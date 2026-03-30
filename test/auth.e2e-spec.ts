import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { request, spec } from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaExceptionFilter } from 'src/common/prisma-exception.filter';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth Resolver (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new PrismaExceptionFilter());

    await app.init();
    await app.listen(0);

    request.setBaseUrl(await app.getUrl());
  });

  afterAll(async () => {
    await app.close();
  });

  it('signup then signin should return accessToken and user', async () => {
    const email = 'test@mre.com';
    const password = '123456';

    await spec()
      .post('/graphql')
      .withBody({
        query: `
          mutation Signup($signupInput: SignupInput!) {
            signup(signupInput: $signupInput) {
              accessToken,
              user {
                id
                email
              }
            }
          }
        `,
        variables: {
          signupInput: {
            email,
            password,
          },
        },
      })
      .expectStatus(200)
      .expectJsonLike({
        data: {
          signup: {
            user: {
              email,
            },
          },
        },
      })
      .expectJsonSchema('data.signup.accessToken', { type: 'string', minLength: 1 });

    await spec()
      .post('/graphql')
      .withBody({
        query: `
          mutation Signin($signinInput: SigninInput!) {
            signin(signinInput: $signinInput) {
              accessToken
              user {
                id
                email
              }
            }
          }
        `,
        variables: {
          signinInput: {
            email,
            password,
          },
        },
      })
      .expectStatus(200)
      .expectJsonLike({
        data: {
          signin: {
            user: {
              email,
            },
          },
        },
      })
      .expectJsonSchema('data.signin.accessToken', { type: 'string', minLength: 1 });
  });

  it('signin with wrong password should return GraphQL error', async () => {
    const email = 'test@mre.com';
    const password = '123456';

    await spec()
      .post('/graphql')
      .withBody({
        query: `
          mutation Signup($signupInput: SignupInput!) {
            signup(signupInput: $signupInput) {
              accessToken
              user {
                id
                email
              }
            }
          }
        `,
        variables: {
          signupInput: {
            email,
            password,
          },
        },
      })
      .expectStatus(200);

    await spec()
      .post('/graphql')
      .withBody({
        query: `
          mutation Signin($signinInput: SigninInput!) {
            signin(signinInput: $signinInput) {
              accessToken
              user {
                id
                email
              }
            }
          }
        `,
        variables: {
          signinInput: {
            email,
            password: 'wrong-password',
          },
        },
      })
      .expectStatus(200)
      .expectJsonLike({
        errors: [
          {
            message: 'Invalid credentials',
          },
        ],
      });
  });

  it('signup with duplicate email should return GraphQL error', async () => {
    const email = 'test@mre.com';
    const password = '123456';

    await spec()
      .post('/graphql')
      .withBody({
        query: `
          mutation Signup($signupInput: SignupInput!) {
            signup(signupInput: $signupInput) {
              accessToken
              user {
                id
                email
              }
            }
          }
        `,
        variables: {
          signupInput: {
            email,
            password,
          },
        },
      })
      .expectStatus(200);

    await spec()
      .post('/graphql')
      .withBody({
        query: `
          mutation Signup($signupInput: SignupInput!) {
            signup(signupInput: $signupInput) {
              accessToken
              user {
                id
                email
              }
            }
          }
        `,
        variables: {
          signupInput: {
            email,
            password,
          },
        },
      })
      .expectStatus(200)
      .expectJsonLike({
        errors: [
          {
            message: 'Credentials taken',
          },
        ],
      });
  });
});

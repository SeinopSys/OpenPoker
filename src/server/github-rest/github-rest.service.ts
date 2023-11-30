import { Injectable, Logger } from '@nestjs/common';
import { serverEnv } from '../server-env';
import { Octokit } from '@octokit/rest';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';

@Injectable()
export class GithubRestService {
  private readonly restClient: Octokit;
  private readonly logger = new Logger(GithubRestService.name);

  constructor() {
    this.restClient = this.clientFactory();
  }

  get defaultClient() {
    return this.restClient;
  }

  public clientFactory(accessToken?: string): Octokit {
    this.logger.debug(`Creating GitHub API REST client…`);
    return new Octokit({
      userAgent: serverEnv.UA_STRING,
      authStrategy: accessToken ? undefined : createOAuthAppAuth,
      auth: accessToken ?? {
        clientId: serverEnv.GITHUB_CLIENT_ID,
        clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
      },
    });
  }
}

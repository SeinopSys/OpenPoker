import { Injectable, Logger } from '@nestjs/common';
import { serverEnv } from '../server-env';
import type { Octokit } from '@octokit/rest';
import type { OctokitOptions } from '@octokit/core/dist-types/types';

@Injectable()
export class GithubRestService {
  private restClient: Promise<Octokit>;
  private readonly logger = new Logger(GithubRestService.name);

  get defaultClient() {
    if (!this.restClient) {
      this.restClient = this.clientFactory();
    }
    return this.restClient;
  }

  public async clientFactory(accessToken?: string): Promise<Octokit> {
    this.logger.debug(`Creating GitHub API REST client…`);
    const { Octokit } = await eval(`import('@octokit/rest')`);
    const { createOAuthAppAuth } = await eval(
      `import('@octokit/auth-oauth-app')`,
    );
    const options: OctokitOptions = {
      userAgent: serverEnv.UA_STRING,
      authStrategy: accessToken ? undefined : createOAuthAppAuth,
      auth: accessToken ?? {
        clientId: serverEnv.GITHUB_CLIENT_ID,
        clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
      },
    };
    return new Octokit(options);
  }
}

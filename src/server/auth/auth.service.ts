import { Injectable, Logger } from '@nestjs/common';
import { GithubUsersService } from '../github-users/github-users.service';
import { UsersService } from '../users/users.service';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GithubUser } from '../github-users/entities/github-user.entity';
import { GithubRestService } from '../github-rest/github-rest.service';
import {
  RestEndpointMethodTypes,
} from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly githubUsersService: GithubUsersService,
    private readonly githubRestService: GithubRestService,
    private readonly entityManager: EntityManager,
  ) {
    this.logger.debug(`Creating default GitHub API REST client…`);
  }

  getGithubUserInfo(params: { userId?: string; accessToken?: string }) {
    this.logger.debug(`Getting GitHub API REST client…`);
    const effectiveClient = params.accessToken
      ? this.githubRestService.clientFactory(params.accessToken)
      : this.githubRestService.defaultClient;
    this.logger.debug(
      `Retrieving GitHub user info ${
        params.accessToken ? 'via access token' : `for user ID ${params.userId}`
      }…`,
    );
    return effectiveClient.rest.users.getAuthenticated();
  }

  async saveGithubUserInfo(
    apiUserInfo: RestEndpointMethodTypes['users']['getAuthenticated']['response'],
    options: {
      existingUser?: User;
      accessToken?: string;
      refreshToken?: string;
      scopes?: string;
    },
  ): Promise<GithubUser> {
    this.logger.debug(`Creating GitHub user information object…`);
    let githubUser = await this.githubUsersService.create(
      {
        id: apiUserInfo.data.id,
        name: apiUserInfo.data.login,
        displayName: apiUserInfo.data.name,
        avatar: apiUserInfo.data.avatar_url,
        gravatarId: apiUserInfo.data.gravatar_id,
        accessToken: options.accessToken ?? null,
        refreshToken: options.refreshToken ?? null,
        scopes: options.scopes ?? null,
      },
      false,
    );
    this.logger.debug(
      `Saving information for GitHub user (${githubUser.id})…`,
    );
    await this.entityManager.transaction(async (em) => {
      if (options.existingUser) {
        this.logger.debug(
          `Linking GitHub user ${githubUser.id} to existing user ${options.existingUser.id}…`,
        );
        githubUser.user = Promise.resolve(options.existingUser);
      } else {
        githubUser = await this.usersService.createForGithubUser(githubUser);
      }

      await em.save(githubUser);
    });
    this.logger.debug(
      `Information for GitHub user (${githubUser.id}) saved successfully`,
    );
    return githubUser;
  }

  async updateGithubUserInfo(
    apiUserInfo: RestEndpointMethodTypes['users']['getAuthenticated']['response'],
    githubUser: GithubUser,
    options: {
      accessToken?: string;
      refreshToken?: string;
      scopes?: string;
    },
  ): Promise<GithubUser> {
    this.logger.debug(`Updating GitHub user (${githubUser.id})…`);
    const result = await this.githubUsersService.update(githubUser, {
      name: apiUserInfo.data.login,
      displayName: apiUserInfo.data.name,
      avatar: apiUserInfo.data.avatar_url,
      gravatarId: apiUserInfo.data.gravatar_id,
      accessToken: options.accessToken ?? null,
      refreshToken: options.refreshToken ?? null,
      scopes: options.scopes ?? null,
    });
    const localUser = await githubUser.user;
    if (!localUser) {
      await this.usersService.createForGithubUser(githubUser);
      await this.entityManager.save(githubUser);
    }
    return result;
  }

  async findUserById(githubId: number): Promise<GithubUser | null> {
    this.logger.debug(`Finding GitHub user with ID ${githubId}…`);
    return await this.githubUsersService.findOne(githubId);
  }
}

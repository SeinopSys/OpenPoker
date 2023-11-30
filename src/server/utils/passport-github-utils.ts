import { AuthService } from '../auth/auth.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { serverEnv } from '../server-env';
import { StateService } from '../state/state.service';
import { StrategyOptions } from 'passport-oauth2';
import { publicPath } from './public-path';

export const getGithubOauthStrategyFactory =
  (stateService: StateService) =>
    (): StrategyOptions => ({
      authorizationURL: `https://github.com/login/oauth/authorize`,
      tokenURL: 'https://github.com/login/oauth/access_token',
      clientID: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
      callbackURL: publicPath('/auth/github'),
      scope: serverEnv.GITHUB_CLIENT_SCOPES,
      state: true,
      store: stateService,
    });

export const githubUserValidatorFactory =
  (authService: AuthService, logger: Logger) =>
    async (accessToken: string, refreshToken: string) => {
      logger.debug('Validating GitHub access token…');
      const userInfo = await authService.getGithubUserInfo({ accessToken });
      const githubUserId = userInfo.data.id;
      logger.debug(`Finding local user for GitHub user ID ${githubUserId}…`);
      let githubUser = await authService.findUserById(githubUserId);
      const tokens = { accessToken, refreshToken };
      if (!githubUser) {
        logger.debug(`GitHub user with ID ${githubUserId} not found, saving…`);
        githubUser = await authService.saveGithubUserInfo(userInfo, tokens);
      } else {
        logger.debug(`Found GitHub user with ID ${githubUserId}, updating…`);
        githubUser = await authService.updateGithubUserInfo(
          userInfo,
          githubUser,
          tokens,
        );
      }

      const localUser = await githubUser.user;
      if (!localUser) {
        throw new UnauthorizedException(
          `No local user exists for GitHub user ${githubUserId}`,
        );
      }

      logger.debug(
        `GitHub user with ID ${githubUserId} validated, local user ID: ${localUser?.id}`,
      );

      return localUser;
    };

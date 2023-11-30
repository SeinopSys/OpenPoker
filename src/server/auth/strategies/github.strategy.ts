import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';
import { StateService } from '../../state/state.service';
import { AppUserValidator } from '../../common/app-user-validator';
import { githubUserValidatorFactory, getGithubOauthStrategyFactory } from '../../utils/passport-github-utils';

@Injectable()
export class GithubStrategy
  extends PassportStrategy(Strategy, 'github')
  implements AppUserValidator {
  private readonly logger = new Logger(GithubStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly stateService: StateService,
  ) {
    const getOauthStrategy =
      getGithubOauthStrategyFactory(stateService);
    super(getOauthStrategy());
  }

  async validate(accessToken: string, refreshToken: string) {
    const githubUserValidator = githubUserValidatorFactory(
      this.authService,
      this.logger,
    );
    return githubUserValidator(accessToken, refreshToken);
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { serverEnv } from '../../server-env';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth.service';
import { StateService } from '../../state/state.service';
import { AppUserValidator } from '../../common/app-user-validator';
import {
  getDiscordOauthStrategy,
  validateDiscordUser,
} from '../../utils/passport-discord-utils';

@Injectable()
export class DiscordStrategy
  extends PassportStrategy(Strategy, 'discord')
  implements AppUserValidator
{
  private readonly logger = new Logger(DiscordStrategy.name);

  constructor(
    private readonly http: HttpService,
    private readonly authService: AuthService,
    private readonly stateService: StateService,
  ) {
    super(
      getDiscordOauthStrategy(stateService)(serverEnv.DISCORD_CLIENT_SCOPES),
    );
  }

  async validate(accessToken: string, refreshToken: string) {
    return validateDiscordUser(this.authService, this.logger)(
      accessToken,
      refreshToken,
    );
  }
}

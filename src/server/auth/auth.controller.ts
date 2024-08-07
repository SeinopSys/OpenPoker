import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { SessionUserGuard } from './guards/session-user.guard';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  @Get('login/github')
  @UseGuards(AuthGuard('github'))
  @Redirect('/', HttpStatus.TEMPORARY_REDIRECT)
  loginWithGithub() {
    // Because this uses the AuthGuard we do not need to manually redirect to the authorization URL
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async getUserFromGithubLogin(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      this.logger.debug('Saving userId to session', req.user);
      req.session.userId = req.user.id;
    } else {
      this.logger.debug(
        'Authentication failed, not saving userId to session',
        req.user,
      );
    }

    res.status(HttpStatus.TEMPORARY_REDIRECT).redirect('/');
  }

  @Post('logout')
  // TODO CSRF protection
  @UseGuards(SessionUserGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    this.logger.debug('Deleting userId from session');
    delete req.session.userId;

    res.status(HttpStatus.TEMPORARY_REDIRECT).redirect('/');
  }
}

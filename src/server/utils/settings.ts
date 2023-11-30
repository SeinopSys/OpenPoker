import { UserSetting } from '../user-settings/entities/user-setting.entity';
import { GithubUsersService } from '../github-users/github-users.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { KnownSettings } from '../user-settings/model/known-settings.enum';
import { Emoji } from '../common/emoji';

export const updateSetting = async <Setting extends KnownSettings>(
  githubUsersService: GithubUsersService,
  userSettingsService: UserSettingsService,
  userId: number,
  setting: Setting,
  value: unknown,
) => {
  let githubUser = await githubUsersService.findOne(userId);
  if (!githubUser) {
    githubUser = await githubUsersService.create({
      id: userId,
      name: 'Unknown User',
      avatar: null,
      displayName: null,
      gravatarId: null,
    });
  }

  let settingRecord: UserSetting | null;
  try {
    settingRecord = await userSettingsService.setSetting(
      githubUser,
      setting,
      value,
    );
  } catch (e) {
    console.error(e);
    return {
      content: `Could not update setting: ${e.message}`,
      ephemeral: true,
    };
  }

  const outcome =
    settingRecord !== null
      ? `updated to \`${JSON.stringify(settingRecord.value).replace(
        /`/,
        '\\`',
      )}\``
      : 'reset to default';

  return {
    content: `${Emoji.CHECK_MARK_BUTTON} Setting \`${setting}\` has been ${outcome} successfully`,
    ephemeral: true,
  };
};

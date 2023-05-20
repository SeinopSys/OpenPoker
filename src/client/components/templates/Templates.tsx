import React, { FC, useMemo } from 'react';
import { useMessageTemplatesList } from '../../hooks/useUserTemplates';
import { LoadingIndicator } from '../common/LoadingIndicator';
import styles from '../../scss/Templates.module.scss';
import { TemplateDisplay } from './TemplateDisplay';

interface TemplatesProps {
  userId: string;
  maxCount: number;
}

export const Templates: FC<TemplatesProps> = ({ userId, maxCount }) => {
  const templateData = useMessageTemplatesList(userId);
  const templateCounter = useMemo(() => {
    if (!templateData.data) return null;

    return ` (${templateData.data.templates.length}/${maxCount})`;
  }, [maxCount, templateData.data]);

  if (templateData.isLoading) return <LoadingIndicator size={128} />;

  return (
    <div className={styles.layout}>
      <h2>Your Templates{templateCounter}</h2>
      <p className={styles.lead}>
        This is where you will find your message templates created via the
        &ldquo;Create Template&rdquo; context menu command of the ChiselTime
        Discord bot.
        <br />
        <br />
        The maximum number of templates you can have at a time is controlled by
        your Patreon support level. Higher tiers enable you to create more
        templates as well as access additional update frequency options.
      </p>
      {templateData.error ? (
        <p className={styles.error}>
          Failed to load templates ({String(templateData.error.status)})
        </p>
      ) : (
        <ol className={styles.list}>
          {templateData.data.templates.map((t) => (
            <TemplateDisplay key={t.id} template={t} />
          ))}
        </ol>
      )}
    </div>
  );
};

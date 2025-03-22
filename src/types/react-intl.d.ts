import { FC } from 'react';
import { IntlShape, MessageDescriptor } from 'react-intl';

declare module 'react-intl' {
  export interface Props extends MessageDescriptor {
    values?: Record<string, any>;
    tagName?: React.ElementType;
    children?: (chunks: any) => React.ReactNode;
  }

  export const FormattedMessage: FC<Props>;
  export const useIntl: () => IntlShape;
} 
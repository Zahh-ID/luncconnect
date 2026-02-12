import React from 'react';
import Button from '../Button';
import useLocales from '../../../hooks/useLocales';

export const FamilyAccountsButton = ({ onClick }: { onClick: () => void }) => {
  const locales = useLocales();

  return (
    <Button
      onClick={onClick}
      variant="secondary"
      style={{ marginBottom: 12, width: '100%' }}
    >
      {locales.continueWithFamily || 'Continue with Family'}
    </Button>
  );
};

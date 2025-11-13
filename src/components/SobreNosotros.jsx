import React from 'react'
import { useTranslation } from 'react-i18next';

const SobreNosotros = () => {
  const { t } = useTranslation();

  return (
    <div className="sobre-nosotros">
        <h1>{t('aboutUs.title')}</h1>
        <p>{t('aboutUs.description')}</p>
    </div>
  )
}

export default SobreNosotros
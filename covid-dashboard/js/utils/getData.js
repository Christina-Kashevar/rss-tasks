import create from './create';

export default () => {
  const data = new Date();
  const dataContainer = create('data', 'data', '', document.querySelector('.header'));
  create(
    'span',
    '',
    `${data.getDate()}.${data.getMonth() + 1}.${data.getFullYear()}`,
    dataContainer,
  );
  return dataContainer;
};

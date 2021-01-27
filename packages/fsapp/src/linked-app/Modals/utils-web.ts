export const makeModalRoot = (id: string) => {
  const el = document.createElement('div');
  el.setAttribute('id', id);
  document.body.appendChild(el);
  return el;
};

export const getModalRoot = (id: string) => {
  return document.getElementById(id) ?? makeModalRoot(id);
};

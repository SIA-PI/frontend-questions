const assert = require('assert');

// mock window
global.window = {
  location: { hash: '#/avaliacoes/nova?tipo=teste1&aluno=1' },
  router: { navigate: () => {} },
  addEventListener: () => {}
};
global.getCurrentUser = () => ({ id: 1, name: 'Admin' });

const html = `
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const tipo = urlParams.get('tipo') || 'teste1';
    console.log('tipo:', tipo);
`;
eval(html);

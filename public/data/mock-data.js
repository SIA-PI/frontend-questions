// Mock Data for SSP Delegacias System

export const mockUsers = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: 'Administrador Sistema',
        role: 'admin',
        email: 'admin@ssp.gov.br'
    },
    {
        id: 2,
        username: 'avaliador1',
        password: 'aval123',
        name: 'João Silva',
        role: 'evaluator',
        email: 'joao.silva@ssp.gov.br'
    },
    {
        id: 3,
        username: 'avaliador2',
        password: 'aval123',
        name: 'Maria Santos',
        role: 'evaluator',
        email: 'maria.santos@ssp.gov.br'
    }
];

export const mockDelegacias = [
    {
        id: 1,
        nome: 'Delegacia Central',
        endereco: 'Av. Principal, 1000',
        cidade: 'Capital',
        telefone: '(85) 3101-0000',
        responsavel: 'Dr. Carlos Mendes'
    },
    {
        id: 2,
        nome: 'Delegacia Norte',
        endereco: 'Rua Norte, 500',
        cidade: 'Capital',
        telefone: '(85) 3101-0001',
        responsavel: 'Dra. Ana Paula'
    },
    {
        id: 3,
        nome: 'Delegacia Sul',
        endereco: 'Av. Sul, 750',
        cidade: 'Capital',
        telefone: '(85) 3101-0002',
        responsavel: 'Dr. Roberto Lima'
    },
    {
        id: 4,
        nome: 'Delegacia Leste',
        endereco: 'Rua Leste, 300',
        cidade: 'Capital',
        telefone: '(85) 3101-0003',
        responsavel: 'Dra. Juliana Costa'
    }
];

export const mockAvaliacoes = [
    {
        id: 1,
        delegaciaId: 1,
        delegaciaNome: 'Delegacia Central',
        avaliadorId: 2,
        avaliadorNome: 'João Silva',
        data: '2026-02-01',
        status: 'Concluída',
        pontuacaoTotal: 85,
        categorias: {
            infraestrutura: 90,
            atendimento: 85,
            seguranca: 80,
            tecnologia: 85
        },
        observacoes: 'Excelente infraestrutura e atendimento ao público.'
    },
    {
        id: 2,
        delegaciaId: 2,
        delegaciaNome: 'Delegacia Norte',
        avaliadorId: 3,
        avaliadorNome: 'Maria Santos',
        data: '2026-02-02',
        status: 'Em andamento',
        pontuacaoTotal: 72,
        categorias: {
            infraestrutura: 75,
            atendimento: 70,
            seguranca: 70,
            tecnologia: 73
        },
        observacoes: 'Necessita melhorias na área de tecnologia.'
    },
    {
        id: 3,
        delegaciaId: 3,
        delegaciaNome: 'Delegacia Sul',
        avaliadorId: 2,
        avaliadorNome: 'João Silva',
        data: '2026-01-28',
        status: 'Concluída',
        pontuacaoTotal: 78,
        categorias: {
            infraestrutura: 80,
            atendimento: 75,
            seguranca: 78,
            tecnologia: 79
        },
        observacoes: 'Bom desempenho geral.'
    },
    {
        id: 4,
        delegaciaId: 4,
        delegaciaNome: 'Delegacia Leste',
        avaliadorId: 3,
        avaliadorNome: 'Maria Santos',
        data: '2026-01-25',
        status: 'Pendente',
        pontuacaoTotal: 0,
        categorias: {
            infraestrutura: 0,
            atendimento: 0,
            seguranca: 0,
            tecnologia: 0
        },
        observacoes: 'Avaliação agendada para próxima semana.'
    }
];

export const mockCategorias = [
    {
        id: 1,
        nome: 'Infraestrutura',
        descricao: 'Avaliação das instalações físicas',
        peso: 25,
        criterios: [
            'Estado de conservação do prédio',
            'Acessibilidade',
            'Iluminação',
            'Ventilação',
            'Limpeza'
        ]
    },
    {
        id: 2,
        nome: 'Atendimento',
        descricao: 'Qualidade do atendimento ao público',
        peso: 30,
        criterios: [
            'Tempo de espera',
            'Cordialidade',
            'Eficiência',
            'Informações claras',
            'Resolução de problemas'
        ]
    },
    {
        id: 3,
        nome: 'Segurança',
        descricao: 'Medidas de segurança implementadas',
        peso: 25,
        criterios: [
            'Controle de acesso',
            'Câmeras de segurança',
            'Equipamentos de proteção',
            'Protocolos de emergência',
            'Treinamento da equipe'
        ]
    },
    {
        id: 4,
        nome: 'Tecnologia',
        descricao: 'Recursos tecnológicos disponíveis',
        peso: 20,
        criterios: [
            'Sistemas informatizados',
            'Conectividade',
            'Equipamentos modernos',
            'Backup de dados',
            'Segurança digital'
        ]
    }
];

export const mockEstatisticas = {
    totalDelegacias: 4,
    totalAvaliacoes: 4,
    avaliacoesCompletas: 2,
    avaliacoesEmAndamento: 1,
    avaliacoesPendentes: 1,
    mediaPontuacao: 78.3,
    melhorDelegacia: {
        nome: 'Delegacia Central',
        pontuacao: 85
    },
    piorDelegacia: {
        nome: 'Delegacia Norte',
        pontuacao: 72
    },
    tendencia: 'positiva'
};

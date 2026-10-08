// storage/agendamento.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "agendamento";

export type Agendamento = {
  servico?:  string | string[];
  barbeiroName?: string;
  hora?: string;
  preco?: string | string[];
  duracao?: string | string[];
};

export async function getAgendamento(): Promise<Agendamento> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// mescla com o que já existe, então cada tela grava só o seu pedaço
export async function saveAgendamento(parcial: Partial<Agendamento>) {
  const atual = await getAgendamento();
  await AsyncStorage.setItem(KEY, JSON.stringify({ ...atual, ...parcial }));
}

export async function limparAgendamento()
{
  await AsyncStorage.removeItem(KEY);
}
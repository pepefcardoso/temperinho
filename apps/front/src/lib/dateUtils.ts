import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata um objeto de data ou uma string de data em um formato legível.
 *
 * Esta função serve como um ponto central para a formatação de datas em toda a aplicação.
 * Atualmente, ela usa o locale 'pt-BR' (português do Brasil) como padrão, mas pode ser
 * facilmente estendida para suportar outros idiomas (internacionalização - i18n).
 *
 * @param {Date | string} date - O objeto de data ou a string de data a ser formatada.
 * Se uma string for fornecida, ela deve estar em um formato que o construtor `new Date()` reconheça (ex: ISO 8601).
 * @param {string} formatString - O padrão de formatação desejado. Utiliza os tokens de `date-fns`.
 * Exemplos:
 * - 'dd/MM/yyyy' -> '31/12/2025'
 * - "d 'de' MMMM 'de' yyyy" -> '31 de Dezembro de 2025'
 * - 'Pp' -> '31/12/2025, 23:59' (data e hora curta)
 *
 * @returns {string} A data formatada como uma string.
 *
 * @example
 * // Para formatar a data de um post de blog
 * const formattedDate = formatDate(post.createdAt, "d 'de' MMMM 'de' yyyy");
 * console.log(formattedDate); // "2 de Julho de 2025"
 *
 * @see https://date-fns.org/v2.30.0/docs/format
 */
export const formatDate = (
  date: Date | string,
  formatString: string
): string => {
  // Converte a entrada para um objeto Date, caso seja uma string.
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Formata a data usando o locale ptBR.
  // Para internacionalização (i18n), o locale poderia ser passado dinamicamente.
  // Ex: `locale: getCurrentLocale()`
  return format(dateObj, formatString, {
    locale: ptBR,
  });
};

/**
 * Constante para a data de atualização dos termos e políticas.
 *
 * Centralizar esta data aqui facilita a atualização, pois só precisa ser alterada
 * em um único lugar. No futuro, essa data poderia vir de variáveis de ambiente
 * ou de um CMS para maior flexibilidade.
 */
export const LAST_UPDATE_DATE = new Date("2025-07-30T00:00:00");

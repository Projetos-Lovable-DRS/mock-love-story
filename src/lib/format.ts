export const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const brlSigned = (value: number) =>
  `${value < 0 ? "− " : "+ "}${brl(Math.abs(value))}`;

export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(`${iso}T12:00:00`),
  );

export const fullDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    new Date(`${iso}T12:00:00`),
  );

export const monthLabel = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00`),
  );

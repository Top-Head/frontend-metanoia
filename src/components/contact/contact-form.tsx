"use client";

import { useState, type FormEvent } from "react";
import { Mail, Send, Tag, User } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import FormInput from "../ui/form-input";
import { Select, type SelectOption } from "../ui/select";

const SUBJECTS: SelectOption[] = [
  { value: "duvida-geral", label: "Dúvida geral", description: "Perguntas sobre a plataforma ou a mentoria" },
  { value: "conta", label: "Suporte com a minha conta", description: "Acesso, cadastro e configurações" },
  { value: "pagamentos", label: "Pagamentos e reembolsos", description: "Cobranças, cancelamentos e estornos" },
  { value: "ser-mentor", label: "Quero ser mentor", description: "Candidatura e processo de revisão" },
  { value: "parcerias", label: "Parcerias e imprensa", description: "Empresas, eventos e comunicação" },
];

const MESSAGE_LIMIT = 1000;

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof INITIAL_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message.trim()) {
      toast.error("Preencha todos os campos para enviar a mensagem.");
      return;
    }

    setIsSubmitting(true);

    // TODO: substituir pela integração real com a API de contato.
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success("Mensagem enviada! Responderemos em breve.");
    setForm(INITIAL_FORM);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          label="Nome"
          placeholder="Seu nome completo"
          autoComplete="name"
          icon={<User size={18} />}
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        <FormInput
          label="E-mail"
          type="email"
          placeholder="nome@email.com"
          autoComplete="email"
          icon={<Mail size={18} />}
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </div>

      <Select
        label="Assunto"
        placeholder="Selecione um assunto"
        icon={<Tag size={18} />}
        options={SUBJECTS}
        value={form.subject}
        onChange={(subject) => updateField("subject", subject)}
      />

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="contact-message" className="text-sm font-bold text-ink">
            Mensagem
          </label>
          <span className="text-xs text-ink-faint" aria-live="polite">
            {form.message.length}/{MESSAGE_LIMIT}
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={6}
          maxLength={MESSAGE_LIMIT}
          placeholder="Conte como podemos ajudar..."
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="w-full resize-none rounded-lg border border-line-strong bg-panel px-3 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full sm:w-auto">
        Enviar mensagem
        {!isSubmitting && <Send size={16} />}
      </Button>
    </form>
  );
}

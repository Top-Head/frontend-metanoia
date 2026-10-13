"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import clsx from "clsx";
import { CalendarDays, ImageIcon, MapPin, Monitor, Tag, User, Users } from "lucide-react";
import { CourseCover } from "@/components/courses/course-cover";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import { Select } from "@/components/ui/select";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ApiError } from "@/lib/api/client";
import type { CourseDetail, CourseType, CourseWrite, Modality } from "@/lib/api/types";
import { listCategories } from "@/services/category.service";

interface CourseFormProps {
  /** Aula existente (edição) ou undefined (criação). */
  initial?: CourseDetail;
  submitLabel: string;
  onSubmit: (payload: CourseWrite) => Promise<void>;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; icon: ReactNode }>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-ink">{label}</p>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={clsx(
              "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all",
              value === option.value ? "bg-panel text-primary shadow-card" : "text-ink-soft hover:text-ink"
            )}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const textareaClass =
  "w-full resize-y rounded-lg border bg-panel px-3 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:ring-1";

export function CourseForm({ initial, submitLabel, onSubmit }: CourseFormProps) {
  const categories = useApiQuery("categories", () => listCategories());

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ? String(initial.category.id) : "");
  const [type, setType] = useState<CourseType>(initial?.type ?? "INDIVIDUAL");
  const [modality, setModality] = useState<Modality>(initial?.modality ?? "ONLINE");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [isFree, setIsFree] = useState(initial?.is_free ?? false);
  const [price, setPrice] = useState(
    initial?.price_amount && !initial.is_free ? String(Number(initial.price_amount)) : ""
  );
  const [capacity, setCapacity] = useState(initial?.capacity != null ? String(initial.capacity) : "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [startDate, setStartDate] = useState(initial?.start_date ?? "");
  const [endDate, setEndDate] = useState(initial?.end_date ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Dê um título à aula.";
    if (!category) next.category = "Escolha uma categoria.";
    if (!isFree && !(Number(price) > 0)) next.price_amount = "Indique um preço maior que zero ou marque como gratuita.";
    if (type === "GROUP" && !(Number(capacity) > 0))
      next.capacity = "Aulas em grupo precisam de uma capacidade (número de alunos).";
    if (modality === "PRESENTIAL" && !location.trim()) next.location = "Indique o local da aula presencial.";
    if (image.trim() && !/^https?:\/\/\S+$/i.test(image.trim()))
      next.image = "Use um link completo, começado por https://.";
    if (startDate && endDate && endDate < startDate) next.end_date = "A data de fim tem de ser depois do início.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.error("Revise os campos destacados.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        image: image.trim(),
        start_date: startDate || null,
        end_date: endDate || null,
        description: description.trim(),
        category: Number(category),
        type,
        modality,
        location: location.trim(),
        price_amount: isFree ? "0.00" : Number(price).toFixed(2),
        currency: "AOA",
        capacity: type === "GROUP" ? Number(capacity) : null,
      });
    } catch (reason) {
      if (reason instanceof ApiError) {
        setErrors(reason.fieldErrors);
        toast.error(reason.message);
      } else {
        toast.error("Não foi possível guardar a aula.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormInput
        label="Título"
        placeholder="Ex.: React do zero ao deploy"
        maxLength={200}
        icon={<Tag size={18} />}
        value={title}
        error={errors.title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <div>
        <Select
          label="Categoria"
          placeholder={categories.isLoading ? "A carregar categorias…" : "Escolha uma categoria"}
          options={(categories.data ?? []).map(({ id, name, description: hint }) => ({
            value: String(id),
            label: name,
            description: hint,
          }))}
          value={category}
          onChange={setCategory}
        />
        {errors.category && <p className="mt-1.5 text-xs font-medium text-danger">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="course-description" className="mb-2 block text-sm font-bold text-ink">
          Descrição
        </label>
        <textarea
          id="course-description"
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="O que o aluno vai aprender, para quem é a aula e como funcionam os encontros."
          className={clsx(
            textareaClass,
            errors.description ? "border-danger focus:ring-danger" : "border-line-strong focus:border-primary focus:ring-primary"
          )}
        />
        {errors.description && <p className="mt-1.5 text-xs font-medium text-danger">{errors.description}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Segmented
          label="Formato"
          value={type}
          onChange={setType}
          options={[
            { value: "INDIVIDUAL", label: "Individual", icon: <User size={16} /> },
            { value: "GROUP", label: "Em grupo", icon: <Users size={16} /> },
          ]}
        />
        <Segmented
          label="Modalidade"
          value={modality}
          onChange={setModality}
          options={[
            { value: "ONLINE", label: "Online", icon: <Monitor size={16} /> },
            { value: "PRESENTIAL", label: "Presencial", icon: <MapPin size={16} /> },
          ]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          label={modality === "PRESENTIAL" ? "Local" : "Local ou link (opcional)"}
          placeholder={modality === "PRESENTIAL" ? "Ex.: Talatona, Luanda" : "Ex.: Google Meet"}
          maxLength={255}
          icon={<MapPin size={18} />}
          value={location}
          error={errors.location}
          onChange={(event) => setLocation(event.target.value)}
        />
        {type === "GROUP" && (
          <FormInput
            label="Capacidade (alunos)"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="Ex.: 12"
            icon={<Users size={18} />}
            value={capacity}
            error={errors.capacity}
            onChange={(event) => setCapacity(event.target.value)}
          />
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          label="Início (opcional)"
          type="date"
          icon={<CalendarDays size={18} />}
          value={startDate}
          error={errors.start_date}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <FormInput
          label="Fim (opcional)"
          type="date"
          min={startDate || undefined}
          icon={<CalendarDays size={18} />}
          value={endDate}
          error={errors.end_date}
          onChange={(event) => setEndDate(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_160px] sm:items-end">
        <FormInput
          label="Imagem de capa (opcional)"
          type="url"
          placeholder="https://…/capa.jpg"
          maxLength={500}
          icon={<ImageIcon size={18} />}
          value={image}
          error={errors.image}
          onChange={(event) => setImage(event.target.value)}
        />
        <CourseCover
          image={image.trim()}
          categorySlug={categories.data?.find((item) => String(item.id) === category)?.slug}
          className="h-24 rounded-xl"
        />
      </div>

      <div className="rounded-xl border border-line bg-canvas p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(event) => setIsFree(event.target.checked)}
            className="size-5 rounded accent-primary"
          />
          <span>
            <span className="block text-sm font-bold text-ink">Aula gratuita</span>
            <span className="block text-xs text-ink-soft">Os alunos não precisam de enviar comprovativo.</span>
          </span>
        </label>
        {!isFree && (
          <div className="mt-4">
            <FormInput
              label="Preço (Kz)"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="Ex.: 15000"
              icon={<span className="text-xs font-bold">Kz</span>}
              value={price}
              error={errors.price_amount}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>
        )}
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}

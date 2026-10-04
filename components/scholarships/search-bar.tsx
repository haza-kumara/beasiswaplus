import { ActionButton } from "@/components/ui/action-button"
import { inputClass } from "@/components/ui/field"

// Form GET biasa: tidak butuh JavaScript client, dan hasilnya bisa di-bookmark.
export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/scholarships" method="get" role="search" className="mb-2 flex gap-2">
      <label htmlFor="search" className="sr-only">Cari beasiswa</label>
      <input id="search" name="search" type="search" defaultValue={defaultValue}
        placeholder="Cari nama beasiswa atau penyelenggara" className={inputClass} />
      <ActionButton type="submit">Cari</ActionButton>
    </form>
  )
}

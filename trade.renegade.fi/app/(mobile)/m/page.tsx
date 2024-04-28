import { MobileBody } from "./body"
import { MobileNav } from "./main-nav"

export const dynamic = "force-dynamic"

export default async function Page() {
  return (
    <div style={{ height: "100vh", overflowY: "hidden" }}>
      <MobileNav />
      <MobileBody />
    </div>
  )
}

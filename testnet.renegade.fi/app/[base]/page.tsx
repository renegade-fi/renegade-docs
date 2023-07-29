import { redirect } from "next/navigation"

export default function Redirect({
  params: { base },
}: {
  params: { base: string }
}) {
  redirect(`/${base}/USDC`)
}

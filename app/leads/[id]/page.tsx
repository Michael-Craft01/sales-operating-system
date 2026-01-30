import { redirect } from "next/navigation";

export default async function LeadPageRedirect(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    // Redirect to the first step of the workflow
    redirect(`/leads/${params.id}/onboarding`);
}

import { NextResponse } from "next/server";

export async function GET(
    _req: Request,
    context: { params: Promise<{ cep: string }> }
) {
    const { cep } = await context.params;

    if (!/^\d{8}$/.test(cep)) {
        return NextResponse.json({ error: "Invalid CEP" }, { status: 400 });
    }

    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return NextResponse.json({ error: "ViaCEP request failed" }, { status: 502 });
    }

    const data = await res.json();

    if (data?.erro) {
        return NextResponse.json({ error: "CEP not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}

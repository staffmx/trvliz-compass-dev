
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { noticeId, targetAssociateId } = await req.json()

    // 1. Iniciar cliente Supabase Admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Obtener datos del aviso
    const { data: notice, error: noticeError } = await supabaseAdmin
      .from('notices')
      .select('*')
      .eq('id', noticeId)
      .single()

    if (noticeError || !notice) throw new Error('Aviso no encontrado')

    // 3. Obtener email del asociado
    const { data: associate, error: associateError } = await supabaseAdmin
      .from('associates')
      .select('email, name, last_name')
      .eq('id', targetAssociateId)
      .single()

    if (associateError || !associate || !associate.email) throw new Error('Asociado o email no encontrado')

    // 4. Autenticación con SendPulse
    const apiId = Deno.env.get('SENDPULSE_API_ID')
    const apiSecret = Deno.env.get('SENDPULSE_API_SECRET')

    const authResponse = await fetch('https://api.sendpulse.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: apiId,
        client_secret: apiSecret,
      }),
    })

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    if (!accessToken) throw new Error('No se pudo obtener el token de SendPulse')

    // 5. Enviar Email vía SMTP API de SendPulse
    const emailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://traveliz.com/trvconnect/16-547x184.png" alt="Traveliz Connect" style="height: 50px;">
        </div>
        <h2 style="color: #1a1a1a; font-size: 20px;">Hola, ${associate.name}</h2>
        <p style="color: #444; line-height: 1.6; font-size: 16px;">
          Has recibido una nueva notificación importante en Compass:
        </p>
        <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1a1a1a;">${notice.title}</h3>
          <div style="color: #555;">${notice.content}</div>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://compass.traveliz.com" style="background: #1a1a1a; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; font-size: 14px;">VER EN COMPASS</a>
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 40px; text-align: center;">
          Este es un mensaje automático de Traveliz Connect. Por favor no respondas a este correo.
        </p>
      </div>
    `

    const sendResponse = await fetch('https://api.sendpulse.com/smtp/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: {
          html: btoa(unescape(encodeURIComponent(emailBody))), // Base64 encoding for SendPulse SMTP API
          text: notice.content,
          subject: `Nueva Notificación: ${notice.title}`,
          from: {
            name: 'Traveliz Connect',
            email: 'connect@traveliz.com',
          },
          to: [
            {
              name: `${associate.name} ${associate.last_name || ''}`,
              email: associate.email,
            },
          ],
        },
      }),
    })

    const sendData = await sendResponse.json()

    return new Response(JSON.stringify({ success: true, data: sendData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

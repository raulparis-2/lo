/*
  CONFIGURACIÓN DEL PROYECTO
  ==========================
  Este es el ÚNICO archivo que hay que tocar para conectar la web con tu
  proyecto de Supabase. Sustituye los dos valores de abajo por los tuyos
  (los encuentras en Supabase → Project Settings → API).

  No hace falta tocar ningún otro archivo de la web.
*/

window.SITE_CONFIG = {
 SUPABASE_URL: "https://yzlaqlyrchnlndjasivu.supabase.co",
 SUPABASE_ANON_KEY: "sb_publishable_8iBB3feqZzTwpWiL_Shc_Q_65Z4NZdn",

  // Nombre del bucket de almacenamiento de imágenes (creado por schema.sql)
  MEDIA_BUCKET: "media"
};

/*
  El formulario de contacto NO usa ningún servicio externo: abre
  directamente la app de correo del visitante con el mensaje ya
  redactado, dirigido al email guardado en "Sobre mí y configuración".
  Por eso no hay ningún endpoint que configurar aquí ni límite de
  mensajes al mes.
*/

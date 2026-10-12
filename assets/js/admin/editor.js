/* Editor de texto sencillo para publicaciones. No requiere que el
   propietario escriba HTML ni Markdown: usa una barra de botones sobre
   un área editable (contenteditable). */

function initRichEditor(bodyEl, toolbarEl, imageFolder) {
  const buttons = [
    { cmd: "bold", label: "Negrita", title: "Negrita" },
    { cmd: "italic", label: "Cursiva", title: "Cursiva" },
    { cmd: "formatBlock", value: "H2", label: "Título 2", title: "Título grande" },
    { cmd: "formatBlock", value: "H3", label: "Título 3", title: "Título pequeño" },
    { cmd: "formatBlock", value: "P", label: "Párrafo", title: "Párrafo normal" },
    { cmd: "insertUnorderedList", label: "Lista", title: "Lista con viñetas" },
    { cmd: "insertOrderedList", label: "Lista num.", title: "Lista numerada" },
    { cmd: "createLink", label: "Enlace", title: "Insertar enlace", needsPrompt: "url" },
    { cmd: "image", label: "Imagen", title: "Insertar imagen", isImage: true }
  ];

  toolbarEl.innerHTML = buttons.map((b, i) =>
    `<button type="button" data-idx="${i}" title="${b.title}">${b.label}</button>`
  ).join("");

  toolbarEl.querySelectorAll("button").forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      bodyEl.focus();
      const b = buttons[i];
      if (b.isImage) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;
          showToast("Subiendo imagen…");
          try {
            const path = await uploadImage(file, imageFolder);
            const url = publicMediaUrl(path);
            document.execCommand("insertHTML", false, `<img src="${url}" alt="">`);
            showToast("Imagen insertada.");
          } catch (err) {
            showToast("No se pudo subir la imagen.", true);
          }
        };
        input.click();
        return;
      }
      if (b.needsPrompt === "url") {
        const url = prompt("Pega aquí la URL del enlace:");
        if (!url) return;
        document.execCommand(b.cmd, false, url);
        return;
      }
      document.execCommand(b.cmd, false, b.value || null);
    });
  });
}

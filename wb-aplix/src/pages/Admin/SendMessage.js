import React, { useState } from 'react';
import { Input, Button, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';


const { TextArea } = Input;
const { Title } = Typography;

const WBMessage = () => {
  const [contacts, setContacts] = useState('');
  const [message, setMessage] = useState('');
  const [activeFormat, setActiveFormat] = useState('');
  sage = () => {
    const [contacts, setContacts] = useState('');
    const [message, setMessage] = useState('');
    const [activeFormat, setActiveFormat] = useState('');
  
  const convertToHTML = (text) => {
    let html = text;
    html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');
    html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    html = html.replace(/~(.*?)~/g, '<em>$1</em>');
    // Aunque ya eliminamos saltos de línea, dejamos este reemplazo por si acaso
    html = html.replace(/\n/g, '<br />');
    return html;
  };

  const toggleFormatting = (format) => {
    const textarea = document.getElementById('messageInput');
    if (!textarea) return;
    const pos = textarea.selectionStart;
    let marker = '';
    if (format === 'bold') marker = '*';
    else if (format === 'italic') marker = '~';
    else if (format === 'strikethrough') marker = '~~';

    // Si el formato ya estaba activo, simplemente insertamos el marcador y desactivamos
    if (activeFormat === format) {
      const newMessage = message.slice(0, pos) + marker + message.slice(pos);
      setMessage(newMessage);
      setActiveFormat('');
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = pos + marker.length;
      }, 0);
    } else {
      // Si no estaba activo, se activa y se inserta el marcador
      const newMessage = message.slice(0, pos) + marker + message.slice(pos);
      setMessage(newMessage);
      setActiveFormat(format);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = pos + marker.length;
      }, 0);
    }
  };

  const handleTextChange = (e) => {
    let value = e.target.value;
    // Elimina cualquier salto de línea
    value = value.replace(/\n/g, '');
    // Reemplaza secuencias de 5 o más espacios por 4 espacios
    value = value.replace(/ {5,}/g, '    ');
    setMessage(value);
  };

  const handleSend = async () => {
    // Separa los contactos por coma y elimina espacios extras
    const contactsArray = contacts
      .split(',')
      .map(c => c.trim())
      .filter(c => c !== '');

    // Recorre cada contacto para enviar el mensaje
    for (const contact of contactsArray) {
      // Se espera el formato "Nombre - Número"
      const [name, phone] = contact.split('-').map(s => s.trim());
      if (!name || !phone) {
        console.warn('Formato de contacto incorrecto:', contact);
        continue;
      }

      // Crea el objeto payload a enviar
      const payload = {
        Phone: phone,
        Name: name,
        MessageCustom: message
      };

      try {
        const response = await fetch('https://wbmessagep.azurewebsites.net/api/SendMessageCustom?', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        console.log(`Mensaje enviado a ${name} (${phone}):`, result);
      } catch (error) {
        console.error(`Error al enviar el mensaje a ${name} (${phone}):`, error);
      }
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <Title level={3}>Enviar Mensaje de WhatsApp</Title>
      
      <Input
        placeholder="Nombre - Número, Nombre - Número"
        value={contacts}
        onChange={(e) => setContacts(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      
      <TextArea
        id="messageInput"
        rows={6}
        placeholder="Escribe tu mensaje"
        value={message}
        onChange={handleTextChange}
        style={{ marginBottom: 10 }}
      />
      
      <div style={{ marginBottom: 10 }}>
        <Button
          type={activeFormat === 'bold' ? 'primary' : 'default'}
          onClick={() => toggleFormatting('bold')}
        >
          Negrita
        </Button>
        <Button
          type={activeFormat === 'italic' ? 'primary' : 'default'}
          onClick={() => toggleFormatting('italic')}
          style={{ marginLeft: 5 }}
        >
          Cursiva
        </Button>
        <Button
          type={activeFormat === 'strikethrough' ? 'primary' : 'default'}
          onClick={() => toggleFormatting('strikethrough')}
          style={{ marginLeft: 5 }}
        >
          Tachado
        </Button>
      </div>
      
      <div style={{ marginBottom: 10 }}>
        <h3>Vista Previa:</h3>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            minHeight: '80px',
            background: '#fafafa'
          }}
          dangerouslySetInnerHTML={{ __html: convertToHTML(message) }}
        />
      </div>
      
      <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
        Enviar Mensaje
      </Button>
    </div>
  );
};

export default WBMessage;

<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email{
    public $email;
    public $nombre;
    public $token;

    public function __construct($email,$nombre,$token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function EnviarConfirmacion(){
        $mail = new PHPMailer();

        //Configurar SMTP
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Username = 'f744c3091038fd';
        $mail->Password = '76cea2efbb9e92';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 2525;

        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com','AppSalon.com');
        $mail->Subject = 'Confirma tu cuenta';

        //habilitar HTML
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        //Definir el contenido
        $contenido = "<html>";
        $contenido .="<p><strong>Hola ". $this->nombre . "</strong> Haz creado tu cuenta en appsalon solo debes confirmarla presionando el siguiente enlace</p>";
        $contenido .="<p>Presiona aquí: <a href='".$_ENV['APP_URL'] ."/confirmar-cuenta?token=" . $this->token."'>Confirmar Cuenta</a></p>";
        $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        //Enviar el email
        $mail->send();
    }

    public function enviarInstrucciones(){

        $mail = new PHPMailer();

        //Configurar SMTP
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];
        $mail->SMTPSecure = 'tls';
        $mail->Port = $_ENV['EMAIL_PORT'];

        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com','AppSalon.com');
        $mail->Subject = 'Restablece tu password';

        //habilitar HTML
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        //Definir el contenido
        $contenido = "<html>";
        $contenido .="<p><strong>Hola ". $this->nombre . "</strong> Haz solicitado restablecer tu password, sigue el siguiente enlace  para hacerlo</p>";
        $contenido .="<p>Presiona aquí: <a href='".$_ENV['APP_URL'] ."/recuperar?token=" . $this->token."'>Restablecer password</a></p>";
        $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        //Enviar el email
        $mail->send();

    }
}
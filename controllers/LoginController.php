<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController {
    public static function login(Router $router){
        $alertas = [];

        $auth = new Usuario;

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth = new Usuario($_POST);
            $alertas = $auth->validarLogin();

            if(empty($alertas)){
                //Comprobar que exista el usuario
                $usuario = Usuario::where('email',$auth->email);
                
                if($usuario){
                    if($usuario->comprobarPassword($auth->password)){
                        //Autenticar el usuario
                        session_start();

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;
                        //Redireccionamiento
                        if($usuario->admin === "1"){
                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header('Location: /admin');
                        }else{
                            header('Location: /cita');
                        }
                    }
                }else{
                    Usuario::setAlerta('error','Usuario no encontrado');
                }
            }
            
        }
        $alertas = Usuario::getAlertas();
        $router->render('auth/login',[
            'alertas' => $alertas,
            'auth' => $auth
        ]);
    }

    public static function logout(){
        //session_start();
        $_SESSION = [];
        header('Location: /');
    }

    public static function olvide(Router $router){
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth = new Usuario($_POST);
            $alertas = $auth->validarEmail();

            if(empty($alertas)){
                $usuario = Usuario::where('email',$auth->email);
                if($usuario && $usuario->confirmado === "1"){
                    //Generar token
                    $usuario->creaToken();
                    $usuario->guardar();

                    //TODO enviar el email
                    $email = new Email($usuario->email,$usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();
                    //alerta de exito
                    Usuario::setAlerta('exito','Por favor, checa tu email');
                    
                }else{
                    Usuario::setAlerta('error','El usuario no existe o no está confirmado');
                }
            }
            $alertas = Usuario::getAlertas();
        }
        $router->render('auth/olvide-password',[
            'alertas' => $alertas
        ]);
    }

    public static function recuperar(Router $router){
        $alertas = [];
        $token = s($_GET['token']);
        $error = false;
        //Buscar usuario por su token
        $usuario = Usuario::where('token',$token);
        if(empty($usuario)){
            Usuario::setAlerta('error','Token no valido');
            $error = true;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            //Leer el nuevo password y guardarlo

            $password = new Usuario($_POST);
            $alertas = $password->validarPassword();
            if(empty($alertas)){
                $usuario->password = null;
                $usuario->password = $password->password;
                $usuario->hashPassword();
                $usuario->token = null;
                $resultado = $usuario->guardar();
                if($resultado){
                    header('Location: /');
                }
            }
        }
        
        $alertas = Usuario::getAlertas();
        $router->render('auth/recuperar-password',[
            'alertas' => $alertas,
            'error' => $error
        ]);
    }

    public static function crearCuenta(Router $router){
        $usuario = new Usuario;

        //Alertas vacias
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            //Revisar que alertas este vacio
            if(empty($alertas)){
                //Verificar que el usuario no esté registrado
                $resultado = $usuario->ExisteUsuario();

                if($resultado->num_rows){
                    $alertas = Usuario::getAlertas();
                }else{
                    //Hashear password
                    $usuario->hashPassword();
                    //Crea token unico
                    $usuario->creaToken();
                    //Enviar el Email
                    $email = new Email($usuario->email,$usuario->nombre,$usuario->token);
                    
                    $email->EnviarConfirmacion();

                    //Crear el usuario
                    $resultado = $usuario->guardar();
                    if($resultado){
                        header('Location: /mensaje');
                    }
                    
                    debuguear($usuario);
                }
            }

        }
        $router->render('auth/CrearCuenta',[
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function mensaje(Router $router){
        $router->render('auth/mensaje');
    }

    public static function Confirmar(Router $router){
        $alertas = [];
        $token = s($_GET['token']);

        $usuario = Usuario::where('token',$token);
        if(empty($usuario)){
            //Mostrar mensaje de rror
            Usuario::setAlerta('error','Token no valido');
        }else{
            //confirmar usuario

            $usuario->confirmado = '1';
            $usuario->token = null;
            $usuario->guardar();
            Usuario::setAlerta('exito','Cuenta comprobada correctamente');
        }
        $alertas = Usuario::getAlertas();

        $router->render('auth/confirmar-cuenta',[
            'alertas' => $alertas
        ]);
    }

    
}
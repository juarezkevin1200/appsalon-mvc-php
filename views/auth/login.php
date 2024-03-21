<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Inicia sesión con tus datos</p>
<?php include_once __DIR__ . "/../template/alertas.php" ?> 

<form action="/" class="formulario" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Ingresa tu email" name="email" value="<?php echo s($auth->email); ?>">
        
    </div>

    <div class="campo">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Tu password" name="password">
    </div>

    <input type="submit" class="boton" value="Iniciar Sesión">
</form>

<div class="acciones">
    <a href="/crearCuenta">¿Aún no tienes una cuenta?,  Crear una</a>
    <a href="/olvide">Olvidaste tu contraseña?</a>
</div>
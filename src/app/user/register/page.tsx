export default function Register() {
  return (
    <div>
      <h1>Cadastro</h1>
      <form id="register-form">
        <label htmlFor="name">Nome:</label>
        <input type="text" id="name" name="name" required />
        <label htmlFor="cpf">CPF:</label>
        <input type="number" id="cpf" name="cpf" />
        <label htmlFor="phone">Telefone:</label>
        <input type="tel" id="phone" name="phone" required />
        <label htmlFor="email">E-mail:</label>
        <input type="email" id="email" name="email" required />
        <label htmlFor="password">Senha:</label>
        <input type="password" id="password" name="password" required />
        <label htmlFor="confirm-password">Confirmar Senha:</label>
        <input type="password" id="confirm-password" name="confirm-password" required />
        <button type="submit">Cadastrar-se</button>

        <p id="errorMessage" className="error"></p>
      </form>
      <a id="login-button" type="button" href="/user/login">
        Login
      </a>
    </div>
  );
}

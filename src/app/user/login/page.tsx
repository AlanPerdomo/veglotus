export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <button type="submit">Login</button>
      </form>

      <p id="errorMessage"></p>
      <a id="register-button" type="button" href="/user/register">
        Cadastrar-se
      </a>
    </div>
  );
}

import { test, expect } from '@playwright/test'
import { obterCodigo2FA } from '../support/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/Dash.Page';
import { LoginActions } from '../actions/LoginActions';
import { cleanJobs, getJob } from "../support/redis"

test('Não deve logar quando o código de autenticação é inválido', async ({ page }) =>{

    const loginPage = new LoginPage(page)

    const usuario = {
        cpf: '00000014141',
        senha: '147258'
    }

    await loginPage.acessaPagina()
    await loginPage.informaCpf(usuario.cpf)
    await loginPage.informmaSenha(usuario.senha)
    await loginPage.informa2FA('123456')

    await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.')

})

test('Deve acessar a conta do usuário', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const dashPage = new DashPage(page);

    const usuario = {
        cpf: '00000014141',
        senha: '147258'
    }

    await cleanJobs()

    await loginPage.acessaPagina()
    await loginPage.informaCpf(usuario.cpf)
    await loginPage.informmaSenha(usuario.senha)

    //checkpoint
    await page.getByRole('heading', {name: 'Verificação em duas etapas'})
        .waitFor({timeout: 3000})

    const codigo = await getJob()
    
    //const codigo = await obterCodigo2FA(usuario.cpf)

    await loginPage.informa2FA(codigo)

    await expect(await dashPage.obterSaldo()).toHaveText('R$5.000,00')
})

test.skip('Deve acessar a conta do usuário 2 - actions', async ({ page }) => {

    const loginActions = new LoginActions(page);

    const usuario = {
        cpf: '00000014141',
        senha: '147258'
    }

    await loginActions.acessaPagina()
    await loginActions.informaCpf(usuario.cpf)
    await loginActions.informmaSenha(usuario.senha)

    //temporario
    await page.waitForTimeout(3000)
    const codigo = await obterCodigo2FA()

    await loginActions.informa2FA(codigo)

    //temporario
    await page.waitForTimeout(2000)

    expect(await loginActions.obterSaldo()).toHaveText('R$5.000,00')

})
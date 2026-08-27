use super::OAuthCallbackBrand;
use super::OAuthCallbackDestination;
use super::OAuthCallbackPage;
use super::render_callback_page;

#[test]
fn success_page_returns_desktop_flows_to_connections() {
    let page = render_callback_page(
        OAuthCallbackPage::Success,
        OAuthCallbackDestination::CodexApp,
        OAuthCallbackBrand::Codex,
    );

    assert!(page.contains("codex://settings/connections"));
    assert!(page.contains("window.history.replaceState"));
    insta::assert_snapshot!("oauth_callback_success_codex_app", page);
}

#[test]
fn success_page_preserves_browser_flow() {
    let page = render_callback_page(
        OAuthCallbackPage::Success,
        OAuthCallbackDestination::Browser,
        OAuthCallbackBrand::Codex,
    );

    assert!(page.contains("You may close this tab and return to Codex"));
    insta::assert_snapshot!("oauth_callback_success_browser", page);
}

#[test]
fn error_page_returns_desktop_flows_without_claiming_success() {
    let page = render_callback_page(
        OAuthCallbackPage::Error,
        OAuthCallbackDestination::CodexApp,
        OAuthCallbackBrand::Codex,
    );

    assert!(!page.contains("Connection complete"));
    insta::assert_snapshot!("oauth_callback_error_codex_app", page);
}

#[test]
fn one_mind_server_names_use_the_branded_matrix_experience() {
    assert_eq!(
        OAuthCallbackBrand::from_server_name("OneMind"),
        OAuthCallbackBrand::OneMind,
    );
    assert_eq!(
        OAuthCallbackBrand::from_server_name("one-mind-beta"),
        OAuthCallbackBrand::OneMind,
    );
    assert_eq!(
        OAuthCallbackBrand::from_server_name("another-server"),
        OAuthCallbackBrand::Codex,
    );
}

#[test]
fn one_mind_success_page_uses_the_authorize_codex_matrix_ui() {
    let page = render_callback_page(
        OAuthCallbackPage::Success,
        OAuthCallbackDestination::CodexApp,
        OAuthCallbackBrand::OneMind,
    );

    assert!(page.contains("OneMind BETA"));
    assert!(page.contains("Authorize Codex"));
    assert!(page.contains("codex://settings/connections"));
    assert!(page.contains("one-mind-auth-panel"));
    assert!(page.contains("one-mind-square-dot-sea"));
    assert!(page.contains("assets/ai-tools/squares/"));
    assert!(!page.contains("{{ONEMIND_SHELL_STYLE}}"));
    assert!(!page.contains("{{ONEMIND_SHELL_SCRIPT}}"));
    insta::assert_snapshot!("oauth_callback_onemind_success_codex_app", page);
}

#[test]
fn one_mind_error_page_preserves_the_matrix_return_path() {
    let page = render_callback_page(
        OAuthCallbackPage::Error,
        OAuthCallbackDestination::CodexApp,
        OAuthCallbackBrand::OneMind,
    );

    assert!(page.contains("Authorization not completed"));
    assert!(page.contains("https://onemind.team/"));
    assert!(page.contains("one-mind-auth-status--error"));
    insta::assert_snapshot!("oauth_callback_onemind_error_codex_app", page);
}

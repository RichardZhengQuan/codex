use std::io::Cursor;

use tiny_http::Header;
use tiny_http::Response;

const SUCCESS_PAGE: &str = include_str!("assets/oauth_callback_success.html");
const ERROR_PAGE: &str = include_str!("assets/oauth_callback_error.html");
const ONEMIND_SUCCESS_PAGE: &str = include_str!("assets/oauth_callback_onemind_success.html");
const ONEMIND_ERROR_PAGE: &str = include_str!("assets/oauth_callback_onemind_error.html");
const ONEMIND_SHELL_STYLE: &str = include_str!("assets/oauth_callback_onemind_shell.css");
const ONEMIND_SHELL_SCRIPT: &str = include_str!("assets/oauth_callback_onemind_shell.js");

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum OAuthCallbackBrand {
    Codex,
    OneMind,
}

impl OAuthCallbackBrand {
    pub(crate) fn from_server_name(server_name: &str) -> Self {
        let normalized = server_name
            .chars()
            .filter(char::is_ascii_alphanumeric)
            .map(|character| character.to_ascii_lowercase())
            .collect::<String>();
        if normalized.starts_with("onemind") {
            Self::OneMind
        } else {
            Self::Codex
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum OAuthCallbackDestination {
    Browser,
    CodexApp,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum OAuthCallbackPage {
    Success,
    Error,
}

fn render_callback_page(
    page: OAuthCallbackPage,
    destination: OAuthCallbackDestination,
    brand: OAuthCallbackBrand,
) -> String {
    let template = match (brand, page) {
        (OAuthCallbackBrand::Codex, OAuthCallbackPage::Success) => SUCCESS_PAGE,
        (OAuthCallbackBrand::Codex, OAuthCallbackPage::Error) => ERROR_PAGE,
        (OAuthCallbackBrand::OneMind, OAuthCallbackPage::Success) => ONEMIND_SUCCESS_PAGE,
        (OAuthCallbackBrand::OneMind, OAuthCallbackPage::Error) => ONEMIND_ERROR_PAGE,
    };
    let returns_to_codex_app = match destination {
        OAuthCallbackDestination::Browser => "false",
        OAuthCallbackDestination::CodexApp => "true",
    };
    let rendered = template.replace("{{RETURN_TO_CODEX_APP}}", returns_to_codex_app);
    match brand {
        OAuthCallbackBrand::Codex => rendered,
        OAuthCallbackBrand::OneMind => rendered
            .replace("{{ONEMIND_SHELL_STYLE}}", ONEMIND_SHELL_STYLE)
            .replace("{{ONEMIND_SHELL_SCRIPT}}", ONEMIND_SHELL_SCRIPT),
    }
}

pub(crate) fn callback_page_response(
    page: OAuthCallbackPage,
    status_code: u16,
    destination: OAuthCallbackDestination,
    brand: OAuthCallbackBrand,
) -> Response<Cursor<Vec<u8>>> {
    let mut response = Response::from_string(render_callback_page(page, destination, brand))
        .with_status_code(status_code);
    let content_security_policy = match brand {
        OAuthCallbackBrand::Codex => {
            "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
        }
        OAuthCallbackBrand::OneMind => {
            "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: https://onemind.team; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
        }
    };
    for (name, value) in [
        ("Content-Type", "text/html; charset=utf-8"),
        ("Cache-Control", "no-store"),
        ("Pragma", "no-cache"),
        ("Referrer-Policy", "no-referrer"),
        ("X-Content-Type-Options", "nosniff"),
        ("Content-Security-Policy", content_security_policy),
    ] {
        if let Ok(header) = Header::from_bytes(name.as_bytes(), value.as_bytes()) {
            response.add_header(header);
        }
    }
    response
}

#[cfg(test)]
#[path = "oauth_callback_page_tests.rs"]
mod tests;

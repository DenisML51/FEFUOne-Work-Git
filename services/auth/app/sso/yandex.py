from app.config import get_settings

settings = get_settings()


def get_yandex_sso():
    if not settings.yandex_client_id or not settings.yandex_secret_id:
        return None
    from fastapi_sso.sso.yandex import YandexSSO

    return YandexSSO(
        client_id=settings.yandex_client_id,
        client_secret=settings.yandex_secret_id,
        redirect_uri=f"{settings.yandex_redirect_domain}/sso/callback",
        allow_insecure_http=True,
    )

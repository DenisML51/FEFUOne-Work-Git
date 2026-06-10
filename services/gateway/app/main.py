from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from .config import ROUTES, settings

_HOP_BY_HOP = {"content-encoding", "transfer-encoding", "connection"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = httpx.AsyncClient(timeout=settings.request_timeout)
    yield
    await app.state.client.aclose()


app = FastAPI(title="MOL Gateway", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.api_route(
    "/api/{service}/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def proxy(service: str, path: str, request: Request) -> Response:
    target = ROUTES.get(service)
    if target is None:
        return Response(status_code=404)

    client: httpx.AsyncClient = request.app.state.client
    headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}

    upstream = await client.request(
        request.method,
        f"{target}/{path}",
        params=request.query_params,
        content=await request.body(),
        headers=headers,
    )

    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers={
            k: v
            for k, v in upstream.headers.items()
            if k.lower() not in _HOP_BY_HOP
        },
    )

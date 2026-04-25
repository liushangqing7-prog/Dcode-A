#!/usr/bin/env python3
"""Dcode-A 本地入口（Python 版本）。

功能保持与根目录 index.html 一致：访问仓库根路径时自动跳转到 ./dnove-web/。
同时提供静态文件服务，便于本地快速预览。
"""

from __future__ import annotations

import argparse
import functools
import http.server
import os
from typing import Tuple


class RedirectToFrontendHandler(http.server.SimpleHTTPRequestHandler):
    """在访问根路径时重定向到前端目录。"""

    def _redirect_if_root(self) -> bool:
        if self.path in {"/", "/index.html"}:
            self.send_response(302)
            self.send_header("Location", "/dnove-web/")
            self.end_headers()
            return True
        return False

    def do_GET(self) -> None:  # noqa: N802 - http.server API uses do_GET
        if self._redirect_if_root():
            return
        super().do_GET()

    def do_HEAD(self) -> None:  # noqa: N802 - http.server API uses do_HEAD
        if self._redirect_if_root():
            return
        super().do_HEAD()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="启动 Dcode-A 的本地 Python 静态服务（根路径自动跳转到 /dnove-web/）。"
    )
    parser.add_argument("--host", default="127.0.0.1", help="监听地址，默认 127.0.0.1")
    parser.add_argument("--port", type=int, default=8000, help="监听端口，默认 8000")
    parser.add_argument(
        "--root",
        default=os.path.dirname(os.path.abspath(__file__)),
        help="静态文件根目录，默认当前仓库根目录",
    )
    return parser.parse_args()


def make_server_address(host: str, port: int) -> Tuple[str, int]:
    return host, port


def main() -> None:
    args = parse_args()
    handler = functools.partial(RedirectToFrontendHandler, directory=args.root)
    server_address = make_server_address(args.host, args.port)

    with http.server.ThreadingHTTPServer(server_address, handler) as httpd:
        print(f"Serving {args.root}")
        print(f"Open: http://{args.host}:{args.port}/")
        print("Root path will redirect to /dnove-web/")
        httpd.serve_forever()


if __name__ == "__main__":
    main()

import { signal } from "@angular/core";

export class TokenService {
    authenticated = signal(false);
}
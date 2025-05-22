import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface SiteStats {
  userCount: number;
  threadCount: number;
  postCount: number;
  onlineUsers: number;
}

@Injectable({
  providedIn: "root",
})
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches site-wide statistics from the backend
   * @returns Observable with site statistics
   */
  getSiteStats(): Observable<SiteStats> {
    return this.http.get<SiteStats>(this.apiUrl);
  }
}

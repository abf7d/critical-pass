// import { Injectable } from '@angular/core';
// import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';
// import { LoggerBase } from '@critical-pass/critical-charts';
// @Injectable({
//     providedIn: 'root',
// })
// export class LoggerService implements LoggerBase {
//     constructor(private _logger: NGXLogger) {}
//     public trace(message, ...additional: any[]): void {
//         this._logger.trace(message, additional);
//     }

//     public debug(message, ...additional: any[]): void {
//         this._logger.debug(message, additional);
//     }

//     public info(message, ...additional: any[]): void {
//         this._logger.info(message, additional);
//     }

//     public log(message, ...additional: any[]): void {
//         this._logger.log(message, additional);
//     }

//     public warn(message, ...additional: any[]): void {
//         this._logger.warn(message, additional);
//     }

//     public error(message, ...additional: any[]): void {
//         this._logger.error(message, additional);
//     }

//     public fatal(message, ...additional: any[]): void {
//         this._logger.fatal(message, additional);
//     }
//     public get level(): NgxLoggerLevel {
//         return this._logger.getConfigSnapshot().level;
//     }
// }

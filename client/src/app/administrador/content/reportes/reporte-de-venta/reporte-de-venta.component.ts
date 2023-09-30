import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, concatMap, map, mergeMap, tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { VentasService } from '../../ventas/service/ventas.service';
import { alert, building, coin, pay } from 'src/app/interfaces/interfaces';
import { CoinsService } from '../../configuraciones/service/coins.service';
import { EmpresaService } from '../../configuraciones/service/empresa.service';
import { Columns, ITable, Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { concat } from 'rxjs'
import { DinamicInput } from 'src/app/utils/DinamicInput';
var pdfFonts = require("pdfmake/build/vfs_fonts"); // fonts provided for pdfmake

// If any issue using previous fonts import. you can try this:
// import pdfFonts from "pdfmake/build/vfs_fonts";

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-reporte-de-venta',
  templateUrl: './reporte-de-venta.component.html',
  styleUrls: ['./reporte-de-venta.component.css']
})
export class ReporteDeVentaComponent extends DinamicInput {
  result: any[] = [];
  data$!: Subscription
  data1$!: Subscription
  date = new Date()
  reportes: any[] = []
  reportesPagos: any[] = []
  reportesByDate: any[] = []
  reportesPagosByDate: any[] = []
  empresa!: building
  formGenerateReport!: FormGroup;
  constructor(private comunicatorSvc: ComunicatorComponetsService,
    private routes: Router,
    private ventasSvc: VentasService,
    private empresaSvc: EmpresaService,
    private fb: FormBuilder) {
    super();
  }
  ngOnInit() {
    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      title.push("fas fa-hand-holding-usd fa-fw");//aañado el icono del titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    });
    const sell = this.ventasSvc.getSellBydate(this.date, this.date)
    const building = this.empresaSvc.getBuildings()
    const pays = this.ventasSvc.getPaysByDate(this.date, this.date)
    const concatenar = concat(sell, pays, building)
    this.data$ = concatenar.subscribe({
      next: res => {
        this.reportes.push(res)
      },
      complete: () => {
        this.empresa = this.reportes[2][0]
        this.reportesPagos = this.reportes[1]
        this.reportes = this.reportes[0] instanceof Array ? this.reportes[0] : []
      }
    })
    this.formGenerateReport = this.fb.group({
      initialDate: new FormControl('', [Validators.required,
      Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      endDate: new FormControl('', [Validators.required,
      Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
    })
  }
  calcularTotales(reportes: any) {
    let values = { sells: 0, total_sell: 0, total_costos: 0, ganancias: 0, coin: '' }
    reportes.forEach((reporte: any) => {
      values.sells += Number(reporte.sells)
      values.total_sell += Number(Number(reporte.total_sell).toFixed(2))
      values.total_costos += Number(Number(reporte.costos).toFixed(2))
      values.ganancias += Number(Number(reporte.total_sell - reporte.costos).toFixed(2))
      values.coin = reporte.coin
    })
    return values
  }
  createPDF(tipo: string) {
    const pdf = new PdfMakeWrapper();
    pdf.add(
      new Columns([
        new Txt(this.empresa.name).fontSize(12).lineHeight(1.4).end,
        ''
      ]).end)
    pdf.add(
      new Columns([
        new Txt(this.empresa.document_type + ' ' + this.empresa.document_number + '\n' +
          'Dirección: ' + this.empresa.address + '\n' + 'Télefono:' + this.empresa.phone_number + '\n' +
          'Email: ' + this.empresa.email).fontSize(8).end,
        ''
      ]).end)
    tipo === 'reporte de hoy' ? this.dataPdf(pdf) : this.dataPdfByDate(pdf)
    pdf.create().open()
  }
  createTables(funcion: Function): ITable {
    return new Table([
      funcion(this.reportes, this.comunicatorSvc.currencyFormatter, this.calcularTotales).header,
      ...funcion(this.reportes, this.comunicatorSvc.currencyFormatter).body
    ]).alignment('center').fontSize(8).widths('*').heights(rowIndex => {
      return rowIndex === 0 ? 13 : 0
    }).layout({
      fillColor(rowIndex: number | undefined, node: any, columnIndex: number | undefined): string {
        return rowIndex === 0 ? '#cccccc' : ''
      },
    }).end
  }
  extractDataSell(reportes: any) {
    let aux = ['Caja', 'Vendedor', 'Ventas realizadas', 'Total en ventas', 'Costos de ventas', 'Ganancias'];
    let other = reportes.map((reporte: any) => [
      reporte.name, reporte.names_user + ' ' + reporte.last_names_user,
      reporte.sells,
      this.comunicatorSvc.currencyFormatter(reporte.total_sell),
      this.comunicatorSvc.currencyFormatter(reporte.costos),
      this.comunicatorSvc.currencyFormatter(reporte.total_sell - reporte.costos)
    ])
    return { header: aux, body: other }
  }
  extractDataTotals(reportes: any) {
    let aux = ['Total ventas realizadas', 'Total en ventas', 'Total costos de ventas', 'Total ganancias'];
    let other = reportes.map((reporte: any) => [
      this.calcularTotales(reportes).sells,
      this.comunicatorSvc.currencyFormatter(this.calcularTotales(reportes).total_sell),
      this.comunicatorSvc.currencyFormatter(this.calcularTotales(reportes).total_costos),
      this.comunicatorSvc.currencyFormatter(this.calcularTotales(reportes).total_sell - this.calcularTotales(reportes).total_costos)
    ])
    return { header: aux, body: other }
  }
  extractDataCoin(pays: any) {
    let aux = ['Moneda', 'Total en transacciones eléctronicas', 'Total en efectivo'];
    let other = pays.map((pay: any) => [
      pay.name + ' ' + pay.symbol,
      this.comunicatorSvc.currencyFormatter(pay.transaccion),
      this.comunicatorSvc.currencyFormatter(pay.efectivo),
    ])
    return { header: aux, body: other }
  }

  dataPdfByDate(pdf: PdfMakeWrapper) {
    let initialDate = new Date(this.formGenerateReport.get('initialDate')?.value)
     let endDate = new Date(this.formGenerateReport.get('endDate')?.value)
     pdf.add(new Txt('Reporte de venta (' +
       new Intl.DateTimeFormat('es-CL').format(initialDate) +
       ' al ' + new Intl.DateTimeFormat('es-CL').format(endDate) + ')').alignment('center')
       .margin([0, 50, 0, 20]).fontSize(10).end)
     pdf.add(this.createTables(this.extractDataSell.bind(this, this.reportesByDate)))
     pdf.add(new Txt('').margin([0, 50, 0, 0]).end)
     pdf.add(this.createTables(this.extractDataTotals.bind(this, this.reportesByDate)))
     pdf.add(new Txt('').margin([0, 50, 0, 0]).end)
     pdf.add(this.createTables(this.extractDataCoin.bind(this, this.reportesPagosByDate))) 
  }
  dataPdf(pdf: PdfMakeWrapper) {
    pdf.add(new Txt('Reporte de venta (' +
      new Intl.DateTimeFormat('es-CL').format(this.date) + ')').alignment('center')
      .margin([0, 50, 0, 20]).fontSize(10).end)
    pdf.add(this.createTables(this.extractDataSell.bind(this, this.reportes)))
    pdf.add(new Txt('').margin([0, 50, 0, 0]).end)
    pdf.add(this.createTables(this.extractDataTotals.bind(this, this.reportes)))
    pdf.add(new Txt('').margin([0, 50, 0, 0]).end)
    pdf.add(this.createTables(this.extractDataCoin.bind(this, this.reportesPagos)))
  }

  consultar() {
    let initialDate = new Date(this.formGenerateReport.get('initialDate')?.value)
    let endDate = new Date(this.formGenerateReport.get('endDate')?.value)
    const sell = this.ventasSvc.getSellBydate(initialDate, endDate)
    const pays = this.ventasSvc.getPaysByDate(initialDate, endDate)
    const concatenar = concat(sell, pays)
    this.data1$ = concatenar.subscribe({
      next: res => {
        console.log(res)
        this.reportesByDate.push(res)
      },
      complete: () => {
        this.reportesPagosByDate = this.reportesByDate[1]
        this.reportesByDate = this.reportesByDate[0] instanceof Array ? this.reportesByDate[0] : []
        this.createPDF('reporte por fecha')
      }
    })
  }
  verificarFechas() {
    let result = { isValid: false, msj: '' }
    if (this.formGenerateReport.get('initialDate')?.invalid) {
      result = { isValid: false, msj: 'La fecha inicial es invalida' }
    } else if (this.formGenerateReport.get('endDate')?.invalid) {
      result = { isValid: false, msj: 'La fecha final es invalida' }
    } else {
      result = { isValid: true, msj: '' }
    }
    return result
  }
  ngOnDestroy() {
    this.data$.unsubscribe();
  }
}

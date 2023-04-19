from io import BytesIO
import datetime
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def create_pdf(data):
  buffer = BytesIO()
  doc = SimpleDocTemplate(buffer, pagesize=A4,
                      rightMargin=1.6*cm, leftMargin=1.6*cm,
                      topMargin=1.6*cm, bottomMargin=1.6*cm
                      )
  
  Story = []

  pdfmetrics.registerFont(TTFont('CMU Bright', 'cmunbmr.ttf'))
  pdfmetrics.registerFont(TTFont('CMU Bright SemiBold', 'cmunbsr.ttf'))
  s = Spacer(1,30)

  header = "INVOICE"

  style = getSampleStyleSheet()
  h_style = ParagraphStyle('header',
                          fontName="CMU Bright SemiBold",
                          fontSize=16,
                          parent=style['Normal'],
                          )
  
  p1 = Paragraph(header, h_style)
  Story.append(p1)

  Story.append(s)

  biller_address = f"""\n
  \n
  \n
  \n
  <u>{data['inputs']['biller_name']}, {data['inputs']['biller_street']}, {data['inputs']['biller_location']}</u>\n
  """

  ba_style = ParagraphStyle('biller_address',
                        fontName="CMU Bright",
                        fontSize=7,
                        parent=style['Normal'],
                        alignment=0
                        )

  def check_for_po_number(arg):
    if 'po_number' in data['inputs']:
      if len(data['inputs']['po_number']) != 0:
        if arg == "key":
          return "PO number" + '\n'
        else:
          return data['inputs']['po_number'] + '\n'
      else: 
        return '\n'
    else:
      return '\n'
    

  biller_key = f"""Biller:\n
  \n
  \n
  \n
  Date:\n
  Invoice No.:\n
  {check_for_po_number("key")}
  """

  bk_style = ParagraphStyle('biller_key',
                          fontName="CMU Bright SemiBold",
                          fontSize=9,
                          parent=style['Normal'],
                          alignment=2,
                          leading=7,
                          borderPadding=0,
                          leftIndent=0*cm,
                          rightIndent=0,
                          spaceAfter=0,
                          spaceBefore=0,
                          splitLongWords=1,
                          spaceShrinkage=0.05,
                          wordWrap = "LTR",
                          allowWidows=1
                          )

  biller_value = f"""{data['inputs']['biller_name']}\n
  {data['inputs']['biller_street']}\n
  {data['inputs']['biller_location']}\n
  \n
  {datetime.datetime.strptime(data['inputs']['date'], '%Y-%m-%d').strftime('%d.%m.%Y')}\n
  {data['inputs']['inv_number']}\n
  {check_for_po_number("value")}
  """

  bv_style = ParagraphStyle('biller_value',
                          parent=bk_style,
                          fontName="CMU Bright",
                          alignment=0,
                          leftIndent=0
                          )

  col_width = [6.3*cm, 8*cm, 3.5*cm]
  two_para = [
    [Paragraph(biller_address.replace("\n", "<br />"), style=ba_style),
     Paragraph(biller_key.replace("\n", "<br />"), style=bk_style), 
     Paragraph(biller_value.replace("\n", "<br />"), style=bv_style)]
  ]

  table = Table(two_para, colWidths=col_width)

  Story.append(table)

  recipient = f"""{data['inputs']['recipient_name']}\n
  {data['inputs']['recipient_street']}\n
  {data['inputs']['recipient_location']}\n
  """

  r_style = ParagraphStyle('recipient',
                          parent=bv_style,
                          alignment=0,
                          borderPadding=0,
                          leftIndent=0
                          )
  p3 = Paragraph(recipient.replace("\n", "<br />"), r_style)
  Story.append(p3)

  Story.append(s)
  Story.append(s)

  table_data = [["Pos", "Qty", "Item", "Unit Price", "Amount"]]
  for idx in range(len(data["positions"])):
    arr = []
    for key, value in data["positions"][idx].items():
      if key in ("price", "amount"):
        value = f"€ {format(float(value), '.2f')}"
      arr.append(value)
    table_data.append(arr)

  table_data.append(["", "", "", "", ""])
  table_data.append(["Subtotal", "", "", "", f"€ {data['amount']['subtotal']:.2f}"])
  table_data.append(["", "", "", "", ""])
  table_data.append(["19% Tax", "", "", "", f"€ {data['amount']['tax']:.2f}"])
  table_data.append(["", "", "", "", ""])
  table_data.append(["Total", "", "", "", f"€ {data['amount']['total']:.2f}"])
  
  c_width = [1.3*cm, 1.4*cm, 11.5*cm, 1.8*cm, 1.8*cm]
  t = Table(table_data, colWidths=c_width)

  TABLE_STYLE = TableStyle([
    ('FONT', (0,0), (-1,0), 'CMU Bright SemiBold'),
    ('FONT', (0,1), (-1,-1), 'CMU Bright'),
    ('BACKGROUND', (0,0), (-1,0), '#EEEEEE'),      
    ('BACKGROUND', (0,-5), (-1,-5), '#EEEEEE'),
    ('LINEBELOW', (0,-3), (-1,-3), 0.5, '#EEEEEE'),
    ('FONT', (0,-1), (-1,-1), 'CMU Bright SemiBold'),
  ])

  for idx in range(len(data["positions"])):
    TABLE_STYLE.add('LINEBELOW', (0,idx+1), (-1,idx+1), 0.5, '#EEEEEE')

  t.setStyle(TABLE_STYLE)

  Story.append(t)

  doc.build(Story)

  print("PDF created successfully")
  return buffer

import ExcelJS from 'exceljs';

const exportToExcel = async (members: any[], userRole: string): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Members');

 
  if (userRole === 'admin_kelurahan') {
    worksheet.columns = [
      { header: 'Nama', key: 'nama', width: 30 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'No. HP', key: 'no_hp', width: 15 },
      { header: 'Tanggal Daftar', key: 'created_at', width: 20 }
    ];
  } else {
    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Nama Wilayah', key: 'nama_wilayah', width: 30 },
      { header: 'Total Anggota', key: 'total', width: 15 }
    ];
    
    
    members.forEach((member, index) => {
      worksheet.addRow({
        no: index + 1,
        nama_wilayah: member.nama, 
        total: 1 
      });
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
};


export {exportToExcel};
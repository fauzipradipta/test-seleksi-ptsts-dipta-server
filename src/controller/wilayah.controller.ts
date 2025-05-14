import { Request, Response } from 'express';
import {
  getWilayahHierarchy,
  getChildWilayah,
  getWilayahSummary,
  getWilayahForExport
} from '../service/wilayah.service';
import { exportToExcel } from '../utils/excelExporter.utils';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getProvinsiList = async (req: Request, res: Response) => {
  try {
    const provinsiList = await getWilayahHierarchy();
    res.json(provinsiList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching provinsi list' });
  }
};

export const getKabupatenByProvinsi = async (req: Request, res: Response) => {
  try {
    const { provinsiId } = req.params;
    const kabupatenList = await getChildWilayah('kabupaten', parseInt(provinsiId));
    res.json(kabupatenList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kabupaten list' });
  }
};

export const getKecamatanByKabupaten = async (req: Request, res: Response) => {
  try {
    const { kabupatenId } = req.params;
    const kecamatanList = await getChildWilayah('kecamatan', parseInt(kabupatenId));
    res.json(kecamatanList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kecamatan list' });
  }
};

export const getKelurahanByKecamatan = async (req: Request, res: Response) => {
  try {
    const { kecamatanId } = req.params;
    const kelurahanList = await getChildWilayah('kelurahan', parseInt(kecamatanId));
    res.json(kelurahanList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kelurahan list' });
  }
};

export const getWilayahSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const summary = await getWilayahSummary(req.user.role, req.user.wilayah_id);
    res.json(summary);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error fetching wilayah summary' });
  }
};

export const exportWilayahData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await getWilayahForExport(req.user.role, req.user.wilayah_id);
    const excelBuffer = await exportToExcel(data, req.user.role);
    
    const fileName = `${req.user.role}-${req.user.wilayah_id}-data`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    res.send(excelBuffer);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error exporting wilayah data' });
  }
};
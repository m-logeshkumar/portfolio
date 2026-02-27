import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://logeshkumar:logesh@mycluster.uvpms2r.mongodb.net/Portfolio?retryWrites=true&w=majority&appName=MyCluster';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '16mb' }));

// ─── Schemas ────────────────────────────────────────────

const resumeSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileData: { type: Buffer, required: true },
    contentType: { type: String, default: 'application/pdf' },
    uploadedAt: { type: Date, default: Date.now },
});

const portfolioSchema = new mongoose.Schema({
    _key: { type: String, default: 'main', unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model('Resume', resumeSchema);
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

const certImageSchema = new mongoose.Schema({
    certId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    fileData: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
});
const CertImage = mongoose.model('CertImage', certImageSchema);

// ─── Multer (memory storage for file uploads) ──────────

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
});

const certUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
        }
    },
});

// ─── Resume API ─────────────────────────────────────────

// Upload resume
app.post('/api/resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Remove any existing resume (keep only one)
        await Resume.deleteMany({});

        const resume = new Resume({
            fileName: req.file.originalname,
            fileData: req.file.buffer,
            contentType: req.file.mimetype,
        });

        await resume.save();
        console.log(`📄 Resume uploaded: ${req.file.originalname}`);
        res.json({ success: true, fileName: req.file.originalname });
    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Download resume
app.get('/api/resume', async (req, res) => {
    try {
        const resume = await Resume.findOne();
        if (!resume) {
            return res.status(404).json({ error: 'No resume found' });
        }
        res.set({
            'Content-Type': resume.contentType,
            'Content-Disposition': `attachment; filename="${resume.fileName}"`,
            'Content-Length': resume.fileData.length,
        });
        res.send(resume.fileData);
    } catch (error) {
        console.error('Resume download error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get resume info (without file data)
app.get('/api/resume/info', async (req, res) => {
    try {
        const resume = await Resume.findOne().select('fileName uploadedAt contentType');
        if (!resume) {
            return res.json({ exists: false });
        }
        res.json({ exists: true, fileName: resume.fileName, uploadedAt: resume.uploadedAt });
    } catch (error) {
        console.error('Resume info error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete resume
app.delete('/api/resume', async (req, res) => {
    try {
        await Resume.deleteMany({});
        console.log('🗑️ Resume deleted');
        res.json({ success: true });
    } catch (error) {
        console.error('Resume delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ─── Portfolio Data API ─────────────────────────────────

// ─── Certificate Image API ──────────────────────────────

// Upload certificate image
app.post('/api/certificate-image/:certId', certUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        await CertImage.findOneAndUpdate(
            { certId: req.params.certId },
            {
                certId: req.params.certId,
                fileName: req.file.originalname,
                fileData: req.file.buffer,
                contentType: req.file.mimetype,
                uploadedAt: new Date(),
            },
            { upsert: true, new: true }
        );
        console.log(`🖼️ Certificate image uploaded for: ${req.params.certId}`);
        res.json({ success: true, fileName: req.file.originalname });
    } catch (error) {
        console.error('Cert image upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get certificate image
app.get('/api/certificate-image/:certId', async (req, res) => {
    try {
        const img = await CertImage.findOne({ certId: req.params.certId });
        if (!img) {
            return res.status(404).json({ error: 'No image found' });
        }
        res.set({ 'Content-Type': img.contentType, 'Cache-Control': 'public, max-age=86400' });
        res.send(img.fileData);
    } catch (error) {
        console.error('Cert image get error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete certificate image
app.delete('/api/certificate-image/:certId', async (req, res) => {
    try {
        await CertImage.deleteOne({ certId: req.params.certId });
        console.log(`🗑️ Certificate image deleted for: ${req.params.certId}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Cert image delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get portfolio data
app.get('/api/portfolio', async (req, res) => {
    try {
        const doc = await Portfolio.findOne({ _key: 'main' });
        if (!doc) {
            return res.status(404).json({ error: 'No portfolio data found' });
        }
        res.json(doc.data);
    } catch (error) {
        console.error('Portfolio get error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save/update portfolio data
app.put('/api/portfolio', async (req, res) => {
    try {
        const doc = await Portfolio.findOneAndUpdate(
            { _key: 'main' },
            { data: req.body, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        console.log('💾 Portfolio data saved');
        res.json({ success: true });
    } catch (error) {
        console.error('Portfolio save error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ─── LeetCode GraphQL Proxy ─────────────────────────────

app.post('/leetcode-api/graphql', async (req, res) => {
    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://leetcode.com',
                'Referer': 'https://leetcode.com/',
            },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('LeetCode proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch LeetCode data' });
    }
});

// ─── Serve Frontend (Production) ────────────────────────

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── Start Server ───────────────────────────────────────

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

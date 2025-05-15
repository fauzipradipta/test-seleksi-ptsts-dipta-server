import { Router } from 'express';
import { 
  loginUser,
  registerAdminUser,
  getCurrentUserProfile,
  changeUserPassword 
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { 
  loginSchema,
  registerAdminSchema,
  changePasswordSchema 
} from '../validations/auth.validation';
import { UserRole } from '../types/custom.types';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin_pusat
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', validateRequest(loginSchema), loginUser);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new admin user (admin_pusat only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *               - wilayah_id
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin_jakarta
 *               password:
 *                 type: string
 *                 example: jakarta123
 *               role:
 *                 type: string
 *                 enum: [admin_provinsi, admin_kabupaten, admin_kecamatan, admin_kelurahan]
 *                 example: admin_provinsi
 *               wilayah_id:
 *                 type: number
 *                 description: ID of the wilayah according to role
 *                 example: 1
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       400:
 *         description: Validation error or username already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only admin_pusat can access)
 *       500:
 *         description: Internal server error
 */
router.post(
  '/register',
  authenticate,
  authorize([UserRole.ADMIN_PUSAT]),
  validateRequest(registerAdminSchema),
  registerAdminUser
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/me', authenticate, getCurrentUserProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change current user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 description: New password
 *                 example: newpassword456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/change-password',
  authenticate,
  validateRequest(changePasswordSchema),
  changeUserPassword
);

export default router;
import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698847090579 implements MigrationInterface {
    name = 'Migration1698847090579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Likes\` (\`project_id\` int UNSIGNED NOT NULL, \`user_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`project_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Projects\` (\`project_id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`user_id\` int UNSIGNED NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`status\` tinyint NOT NULL DEFAULT '0', \`view\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`project_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Users\` (\`user_id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`profile_img\` varchar(255) NULL, \`introduction\` varchar(255) NULL, \`authLevel\` int UNSIGNED NOT NULL DEFAULT '0', \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` (\`email\`), UNIQUE INDEX \`IDX_5da3f86a40ce07289424c734c9\` (\`nickname\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Comments\` (\`comment_id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`comment\` text NOT NULL, \`project_id\` int UNSIGNED NOT NULL, \`user_id\` int UNSIGNED NOT NULL, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`comment_id\`, \`project_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Likes\` ADD CONSTRAINT \`FK_e7bf078b4e3c2c8122abc1b48c7\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Likes\` ADD CONSTRAINT \`FK_bc00429378ddbfa066fda7c9511\` FOREIGN KEY (\`project_id\`) REFERENCES \`Projects\`(\`project_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Projects\` ADD CONSTRAINT \`FK_2888c0b921e297a1124e203d91c\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_ff2b4ceb89a35315878c06007b3\` FOREIGN KEY (\`project_id\`) REFERENCES \`Projects\`(\`project_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_22ec3485cde8dfcd915922addc1\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_22ec3485cde8dfcd915922addc1\``);
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_ff2b4ceb89a35315878c06007b3\``);
        await queryRunner.query(`ALTER TABLE \`Projects\` DROP FOREIGN KEY \`FK_2888c0b921e297a1124e203d91c\``);
        await queryRunner.query(`ALTER TABLE \`Likes\` DROP FOREIGN KEY \`FK_bc00429378ddbfa066fda7c9511\``);
        await queryRunner.query(`ALTER TABLE \`Likes\` DROP FOREIGN KEY \`FK_e7bf078b4e3c2c8122abc1b48c7\``);
        await queryRunner.query(`DROP TABLE \`Comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_5da3f86a40ce07289424c734c9\` ON \`Users\``);
        await queryRunner.query(`DROP INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` ON \`Users\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
        await queryRunner.query(`DROP TABLE \`Projects\``);
        await queryRunner.query(`DROP TABLE \`Likes\``);
    }

}

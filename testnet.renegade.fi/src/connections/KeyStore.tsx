import * as ed from "@noble/ed25519";
import BN from "bn.js";

class RenegadeKeypair {
  // Hex of 2^255 - 19.
  static CURVE_25519_FIELD_ORDER = new BN(
    "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed",
    16,
  );

  _secretKey: null | BN;
  _publicKey: null | BN;

  static default() {
    return new RenegadeKeypair(null);
  }

  constructor(secretKey: null | BN) {
    if (secretKey === null) {
      this._secretKey = null;
      this._publicKey = null;
    } else {
      if (
        secretKey.lt(new BN(0)) ||
        secretKey.gt(RenegadeKeypair.CURVE_25519_FIELD_ORDER)
      ) {
        throw new Error(
          "Secret key is out of range: " + secretKey.toString(16),
        );
      }
      this._secretKey = secretKey;
      this._publicKey = RenegadeKeypair._recoverPublicKey(secretKey);
    }
  }

  async signMessage(message: string): Promise<Uint8Array> {
    if (this._secretKey === null) {
      throw new Error("The default keypair cannot sign messages.");
    }
    const secretKeyArray = Buffer.from(this._secretKey.toArray("be", 32));
    const messageArray = Buffer.from(message, "ascii");
    const signature = await ed.sign(messageArray, secretKeyArray); // 64 bytes
    return signature;
  }

  get publicKey() {
    return this._publicKey;
  }

  isDefault(): boolean {
    return this._secretKey === null;
  }

  /**
   * Recover the public key for a given secret key.
   *
   * Use fast exponentiation to compute:
   * 2^secretKey mod (2^255 - 19)
   */
  static _recoverPublicKey(secretKey: BN): BN {
    let publicKey = new BN(1);
    // `iterativeSquareModP` keeps tracks of 2^(2^i) mod (2^255 - 19)
    let iterativeSquareModP = new BN(2);
    for (let i = 0; i < 255; i++) {
      // If the binary representation of the secret key has a 1 at this index,
      // multiply the public key by the current iterative square.
      if (secretKey.and(new BN(2).pow(new BN(i))).gt(new BN(0))) {
        publicKey = publicKey.mul(iterativeSquareModP);
        publicKey = publicKey.mod(RenegadeKeypair.CURVE_25519_FIELD_ORDER);
      }
      // Advance the iterative square.
      iterativeSquareModP = iterativeSquareModP.mul(iterativeSquareModP);
      iterativeSquareModP = iterativeSquareModP.mod(
        RenegadeKeypair.CURVE_25519_FIELD_ORDER,
      );
    }
    return publicKey;
  }
}

class StarkNetKeypair {
  static default() {
    return new StarkNetKeypair();
  }
}

/**
 * The KeyStore manages all keypairs, both Renegade-native and StarkWare keys.
 * Since the KeyStore needs to be accessible in a React context, we do not
 * mutate a global KeyStore directly. Rather, the KeyStore class provides
 * static functions for operating over a KeyStoreState, which is stored in the
 * React context.
 */
export interface KeyStoreState {
  renegadeKeypairs: { [key: string]: RenegadeKeypair };
  starkNetKeypair: StarkNetKeypair;
}
export default class KeyStore {
  static CREATE_SK_ROOT_MESSAGE = "Unlock your Renegade wallet.\nTestnet v1";
  static CREATE_SK_MATCH_MESSAGE = "Unlock your Renegade match key.\nv1";
  static CREATE_SK_SETTLE_MESSAGE = "Unlock your Renegade settle key.\nv1";
  static CREATE_SK_VIEW_MESSAGE = "Unlock your Renegade view key.\nv1";

  static default(): KeyStoreState {
    return {
      renegadeKeypairs: {
        root: RenegadeKeypair.default(),
        match: RenegadeKeypair.default(),
        settle: RenegadeKeypair.default(),
        view: RenegadeKeypair.default(),
      },
      starkNetKeypair: StarkNetKeypair.default(),
    };
  }

  /**
   * Given a signature of the message "Unlock you Renegade wallet.\nv1.0.0",
   * populates a KeyStoreState with all internal Renegade key hierarchies and
   * the StarkNet key.
   */
  static async fromSignature(signature: string): Promise<KeyStoreState> {
    if (!signature.startsWith("0x")) {
      throw new Error("Signature expected to start with 0x.");
    }
    const signatureBytes = Buffer.from(signature.slice(2), "hex");
    if (signatureBytes.length !== 65) {
      throw new Error("Signature expected to be 65 bytes.");
    }
    return {
      renegadeKeypairs: await this._generateRenegadeKeypairs(signatureBytes),
      starkNetKeypair: this._generateStarkNetKeypair(signatureBytes),
    };
  }

  /**
   * Returns true if the user has not yet populated the key hierarchy.
   */
  static isUnpopulated(keyStoreState: KeyStoreState): boolean {
    return keyStoreState.renegadeKeypairs.root.isDefault();
  }

  /**
   * Given an array of bytes, hash the array with SHA-256, and return the
   * resulting hash modulo Curve25519 field order.
   */
  static async _hashBytesMod25519(bytes: Uint8Array): Promise<BN> {
    const hash = await window.crypto.subtle.digest("SHA-256", bytes);
    const hashBN = new BN(new Uint8Array(hash), undefined, "be");
    const hashMod25519 = hashBN.mod(RenegadeKeypair.CURVE_25519_FIELD_ORDER);
    return hashMod25519;
  }

  /**
   * Given a 65-byte ECDSA signature, computes the entire Renegade key hierarchy.
   */
  static async _generateRenegadeKeypairs(signatureBytes: Uint8Array): Promise<{
    [key: string]: RenegadeKeypair;
  }> {
    // Deive the root key.
    const rootSecretKey = await KeyStore._hashBytesMod25519(signatureBytes);
    const root = new RenegadeKeypair(rootSecretKey);

    // Derive the match key.
    const rootSignatureBytes = await root.signMessage(
      KeyStore.CREATE_SK_MATCH_MESSAGE,
    );
    const matchSecretKey = await KeyStore._hashBytesMod25519(
      rootSignatureBytes,
    );
    const match = new RenegadeKeypair(matchSecretKey);

    // Derive the settle key.
    const matchSignatureBytes = await match.signMessage(
      KeyStore.CREATE_SK_SETTLE_MESSAGE,
    );
    const settleSecretKey = await KeyStore._hashBytesMod25519(
      matchSignatureBytes,
    );
    const settle = new RenegadeKeypair(settleSecretKey);

    // Derive the view key.
    const settleSignatureBytes = await settle.signMessage(
      KeyStore.CREATE_SK_VIEW_MESSAGE,
    );
    const viewSecretKey = await KeyStore._hashBytesMod25519(
      settleSignatureBytes,
    );
    const view = new RenegadeKeypair(viewSecretKey);

    return { root, match, settle, view };
  }

  /**
   * Given a 65-byte ECDSA signature, computes the StarkNet keypair.
   */
  static _generateStarkNetKeypair(
    _signatureBytes: Uint8Array,
  ): StarkNetKeypair {
    return StarkNetKeypair.default(); // TODO
  }
}